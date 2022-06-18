# VMess protocol

VMess is the original encrypted communication protocol of V2Ray.

## Protocol version

The current version number is 1.

## Principals

### Transport

VMess is a TCP-based protocol, and all data is transferred using TCP.

### User ID

ID is equivalent to [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier), a 16-byte long random hexadecimal string that acts as a Token.
Example of a UUID: de305d54-75b4-431b-adb2-eb6b9e546014; almost fully randomized, and can be generated using any UUID generator, such as [this](https://www.uuidgenerator.net/).

The user ID can be specified in the [configuration file](../config/overview.md).

### Functions

* MD5: [MD5 function](https://en.wikipedia.org/wiki/MD5)
  * Input is a byte array of arbitrary length
  * Output is a 16 byte array
* HMAC: [HMAC function](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)
  * Input parameters:
    * H: Hash function
    * K: Key, arbitrary length byte array
    * M: Message, arbitrary length byte array
* Shake: [SHA3-Shake128 function](https://en.wikipedia.org/wiki/SHA-3)
  * Input is a string of arbitrary length
  * Output is a string of arbitrary length

## Communication process

VMess is a stateless protocol. That is, the client and server do not need to handshake to directly transfer data, and each data transfer does not affect other data transfers before or after it.
The VMess client initiates a request, and the server determines whether the request comes from a legitimate client. If the verification passes, the request is forwarded and the response is returned to the client.
VMess uses an asymmetric format. That is, the request sent by the client and the response replied by the server use different formats.

## Client request

|    16 bytes    | X bytes | Remaining Payload |
|----------------|---------|-------------------|
| Authentication | Command | Data...           |

### Authentication

The Authentication header is a 16-byte hash value, which is calculated as follows:

* H = MD5
* K = User ID (16 bytes)
* M = UTC time, accurate to seconds, the value is the current time plus or minus 30 seconds (8 bytes, Big Endian)
* Hash = HMAC(H, K, M)

### Command

The Command header is encrypted by AES-128-CFB:

* Key: MD5(User ID + []byte('c48619fe-8f02-49e0-b9e9-edf763e17e21'))
* IV: MD5(X + X + X + X), X = []byte (UTC time at authentication header generation) (8 bytes, Big Endian)

| 1 byte | 16 bytes | 16 bytes | 1 byte | 1 byte | 4 bit | 4 bit | 1 byte | 1 byte | 2 bytes | 1 byte | N bytes | P byte | 4 bytes |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Version `Ver` | Encryption `IV` | Encryption `Key` | Response Auth Pad `V` | Options `Opt` | Padding `P` | Encryption Algorithm `Sec` | `Keep` | Command `Cmd` | `Port` | Address Type `T` | Address `A` | Random Padding | Message Checksum `F` |

Option `Opt` details: (A bit set to 1 enables the option)

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| X | X | X | X | X | M | R | S |

Where:

* Version `Ver`: Currently always `1`;
* Encryption `IV`: random value;
* Encryption `Key`: random value;
* Response Auth Pad `V`: random value;
* Options `Opt`:
  * S (`0x01`): standard format data stream (recommended to open);
  * R (`0x02`): The client expects to reuse TCP connections (V2Ray 2.23+ deprecated);
   * Only valid when S is also enabled;
  * M (`0x04`): Enable metadata obfuscation (Recommended);
    * Only valid when S is also enabled;
    * While enabled, the client and server need to construct two Shake instances separately: RequestMask = Shake (request data IV), and ResponseMask = Shake (response data IV).
  * X: Reserved
* Padding `P`: Pad with P bytes of random data;
* Encryption Algorithm `Sec`: Specify the encryption method of the data payload:
  * `0x00`: AES-128-CFB;
  * `0x01`: No encryption;
  * `0x02`: AES-128-GCM;
  * `0x03`: ChaCha20-Poly1305;
* Command `Cmd`:
  * `0x01`: TCP data;
  * `0x02`: UDP data;
* `Port`: Integer destination port number in Big Endian format;
* Address Type `T`:
  * `0x01`: IPv4
  * `0x02`: Domain name
  * `0x03`: IPv6
* Address `A`:
  * While T = `0x01`, A is a 4-byte IPv4 address;
  * While T = `0x02`, A is 1-byte length parameter (L) + L-byte length domain name;
  * While T = `0x03`, A is a 16-byte IPv6 address;
* Message Checksum `F`: FNV1a hash of all contents except F in the Command header;

### Data payload

Two data formats are supported, defaulting to the Basic format:

#### Basic format (Deprecated)

**This format is included only for backward compatibility reasons and may be removed in future versions. **

All data is assumed to be the actual content of the client's request. This content will be sent to the address specified in the Command header. If `Cmd` = `0x01`, data will be sent in TCP form; If `Cmd` = `0x02`, data will be sent in UDP form.

This format supports two encryption options: "unencrypted" and "AES-128-CFB". The encryption Key and IV are specified by the Command header.

#### Standard Format

When `Opt(S)` is enabled, the Data payload uses this format. The actual request data is divided into several small blocks, and the format of each block is as follows. After the server verifies the integrity of all blocks, it forwards them similarly to the basic format.

| 2 bytes  |   L bytes   |
|:--------:|:-----------:|
| Length L | Data Packet |

Where:

* Length L: Big Endian integer, maximum value 2^14;
  * When `Opt(M)` is enabled, L is set to `xor Mask.Mask = (RequestMask.NextByte() << 8) + RequestMask.NextByte()`;
* Data Packet: Block encrypted by the specified encryption method;

Before the end of transmission, there must be actual data present in the data packet. That is, data other than the length L and headers. When the transmission ends, the client shall send an empty data packet of zero length L (not encrypted), or the length of the authentication header (encrypted), to indicate the end of transmission.

Depending on the encryption method, the format of the data packet is as follows:

* Unencrypted:
  * L bytes: Actual data payload;
* AES-128-CFB: Payload is encrypted with AES-128-CFB
  * 4 bytes: FNV1a hash of actual data payload (Big-Endian);
  * L-4 bytes: Actual data payload;
* AES-128-GCM: Key is specified in Command header, IV = count (2 bytes) + IV (10 bytes). Count starts from 0 and increases by 1 for each data packet; IV is the bytes 3 to 12 of the Command header `IV`.
  * L-16 bytes: Actual data payload;
  * 16 bytes: GCM authentication code
* ChaCha20-Poly1305: Key = MD5 (Command header `Key`) + MD5 (MD5 (Command header `Key`)), IV = count (2 bytes) + IV (10 bytes). Count starts from 0 and increases by 1 for each data packet; IV is bytes 3 to 12 of the Command header `IV`.
  * L-16 bytes: Actual data payload;
  * 16 bytes: Poly1305 authentication information

## Server response

The header data of the response is encrypted with AES-128-CFB, where the IV is MD5 (data encryption IV), and the Key is MD5 (data encryption Key). The actual response data varies depending on the encryption settings.

|       1 byte        |     1 byte    |    1 byte     |      1 byte      |      M byte     |        Remaining Data       |
|---------------------|---------------|---------------|------------------|-----------------|-----------------------------|
| Response Auth Pad `V` | Options `Opt` | Command `Cmd` | Command Length `M` | Command Payload | Actual response data payload|

Where:

* Response Auth Pad `V`: must be the same as the Response Auth Pad `V` in the client request;
* Options `Opt`:
  * 0x01: The server can reuse this TCP connection (obsoleted since v2.23);
* Command `Cmd`:
  * 0x01: Use dynamic port (See [Dynamic Port Command](#Dynamic-Port-Command))
* Actual response data:
  * If `Opt(S)` was enabled in the request, the standard format is used, otherwise default to the basic format.
  * When Opt(M) is enabled, L is set to `xor Mask.Mask = (ResponseMask.NextByte() << 8) + ResponseMask.NextByte()`;

### Dynamic Port Command

|  1 byte  | 2 byte | 16 byte | 2 byte  |   1 byte   | 1 byte  |
|----------|--------|---------|---------|------------|---------|
| Reserved |  Port  | User ID | AlterID | User level | TTL `T` |

Where:

* Port: Big Endian integer port number;
* Time-To-Live `T`: Time in minutes;

If a client receives the dynamic port command, the server has opened a new dynamic port, which the client can utilize to send future data. After T minutes, this port is invalidated and the client must revert to using the main port again.

## Notes

* To ensure backward compatibility, the values of all reserved fields must be 0.

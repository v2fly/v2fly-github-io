# Working Mechanism

## Single server mode

Like other network proxy tools, you need a server configured with V2Ray, and then install and configure the V2Ray client on your device, and then you can smoothly access the Internet.

[![](https://mermaid.ink/img/pako:eNpdj7EKwjAQQH8l3JRCo-AYQaitTg6lQqcsp7naYJNKmiIi_XdTUQe34713cPeEc68JJFw83lp2qNbKZbzMEyYWgm353ni6Y9clkW9ntmE575tGzJDd6TSYQLPMmIiu4PWqwseyLo8zLN4w_-kdN-5vE1Kw5C0aHY94KseYgtCSJQUyjhr9VYFyU-zGm8ZAO21C70E22A2UAo6hPz7cGWTwI32jwmB8yH6q6QUwM0iC)](https://mermaid.live/edit#pako:eNpdj7EKwjAQQH8l3JRCo-AYQaitTg6lQqcsp7naYJNKmiIi_XdTUQe34713cPeEc68JJFw83lp2qNbKZbzMEyYWgm353ni6Y9clkW9ntmE575tGzJDd6TSYQLPMmIiu4PWqwseyLo8zLN4w_-kdN-5vE1Kw5C0aHY94KseYgtCSJQUyjhr9VYFyU-zGm8ZAO21C70E22A2UAo6hPz7cGWTwI32jwmB8yH6q6QUwM0iC)

A V2Ray server can simultaneously support multiple devices to access using different proxy protocols. At the same time, after reasonable configuration, V2Ray can identify and distinguish between the traffic that needs a proxy and the traffic that does not require a proxy. Directly connected traffic does not require detours.

## Bridge mode

If you don't want to configure routing on every device, you can also set up a transit server to receive all the traffic sent by the client, and then forward the judgment in the server.

[![](https://mermaid.ink/img/pako:eNpdj8sKwjAQRX9lmFUKxg-oINjXyoVYcJVNbKY22CaSJoiI_26sVtDdcM-Zy8wdG6sIUzw5eelgu18Js2G7PAG-5GvIWKUdXWXfJxFk7zBntm35K4QrHUft6QU3wCMr2GFXgzbgO4J5r5hQOSEb_KgV_fBy4vnXrJg2f_24wIHcILWKt96FARAYKwYSmMZRSXcWKMwjeuGipKdSaW8dpq3sR1qgDN7WN9Ng6l2gWSq0jH8PH-vxBAUaVQg)](https://mermaid.live/edit#pako:eNpdj8sKwjAQRX9lmFUKxg-oINjXyoVYcJVNbKY22CaSJoiI_26sVtDdcM-Zy8wdG6sIUzw5eelgu18Js2G7PAG-5GvIWKUdXWXfJxFk7zBntm35K4QrHUft6QU3wCMr2GFXgzbgO4J5r5hQOSEb_KgV_fBy4vnXrJg2f_24wIHcILWKt96FARAYKwYSmMZRSXcWKMwjeuGipKdSaW8dpq3sR1qgDN7WN9Ng6l2gWSq0jH8PH-vxBAUaVQg)

## working principle

Before configuring V2Ray, let’s take a look at the working principle of V2Ray. The following is a schematic diagram of the internal structure of a single V2Ray process. Multiple V2Rays are independent of each other and do not affect each other.

[![](https://mermaid.ink/img/pako:eNptkD0LwjAQQP9KuKmFFunHFEFQ4iYO7ZolNtEGTVLSZJDS_25aFUW7Pd49Du4GaAwXgOFiWdeiQ7WmeptFUp-M1zxGabpBJCKy75hrWmHRClXGuxnIsY6nPP_JJ1csuPLfkZl2WRR2PkcfmS_JYkmWXxISUMIqJnk4aqAaIQquFUpQwAE5s1cKVI-h8x1nTuy5dMYCPrNbLxJg3pn6rhvAznrxjohk4UHqVY0PgRNhlQ)](https://mermaid.live/edit#pako:eNptkD0LwjAQQP9KuKmFFunHFEFQ4iYO7ZolNtEGTVLSZJDS_25aFUW7Pd49Du4GaAwXgOFiWdeiQ7WmeptFUp-M1zxGabpBJCKy75hrWmHRClXGuxnIsY6nPP_JJ1csuPLfkZl2WRR2PkcfmS_JYkmWXxISUMIqJnk4aqAaIQquFUpQwAE5s1cKVI-h8x1nTuy5dMYCPrNbLxJg3pn6rhvAznrxjohk4UHqVY0PgRNhlQ)

* You need to configure at least one inbound protocol (Inbound) and one outbound protocol (Outbound) to work properly.
  * The inbound protocol is responsible for communicating with the client (such as a browser):
    * Inbound protocols can usually configure user authentication, such as ID and password;
    * After the inbound protocol receives the data, it will be handed over to the Dispatcher for distribution;
  * The outbound protocol is responsible for sending data to the server, such as V2Ray on another host.
* When there are multiple outbound protocols, routing can be configured to specify that a certain type of traffic is sent by a certain outbound protocol.
  * When necessary, the router will query the DNS for more information to make a judgment.

The specific configuration format is detailed in [Chapter 2](../config/overview.md).

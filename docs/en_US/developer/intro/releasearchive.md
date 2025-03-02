# 发布存档  

本文介绍了 V2Ray 发布存档的设计理念。  

V2Ray 使用 GitHub Action 来构建发布版本。然而，GitHub Action 是按使用量计费的产品，无法长期存储日志和构建产物，否则将产生高额费用。  

因此，我们使用 [AutoV2RayActionArchive](https://github.com/xiaokangwang/AutoV2RayActionArchive) 将日志和构建产物上传至 [Internet Archive](https://archive.org/details/v2ray-action-archive-hqfi0pb)。您可以在那里找到已过期的日志和构建产物。

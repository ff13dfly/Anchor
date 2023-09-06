# Hello World

## 先让我们看下结果

- 通过**Hello World**程序之后，你将完整的理解怎么将数据写到链上。例如，**hello**就已经被使用，并写在了测试网络的链上，通过这个链接[https://polkadot.js.org/apps/?rpc=wss://dev.metanchor.net](https://polkadot.js.org/apps/?rpc=wss://dev.metanchor.net)你就可以访问到数据。这就是Web3.0的神奇所在，数据是开放的、被拥有的，除了你之外，别人是无法篡改的。所以，我们就可以分享链接来展示你在Web3.0上的数据。

- 接下来，让我们看看**hello**这个Anchor数据都有些啥，稍作整理就是这样的数据结构。你也可以通过这个链接[https://polkadot.js.org/apps/?rpc=wss://dev.metanchor.net#/explorer/query/44629](https://polkadot.js.org/apps/?rpc=wss://dev.metanchor.net#/explorer/query/44629)来看看真实的链上数据。

```JSON
    {
        "name":"hello",
        "raw":"hello world",
        "protocol":{"type":"data"},
        "block":44629,
        "signer":"5GhU2JnMPGCNnoLbZmJBvrkGcVPm9AkzFUea4f99sHNa39jm"
    }
```

- 当你发现，只需要1个小时的学习和尝试，就可以将数据写入到Web3.0，是不是感觉有点小兴奋呢，让我们开始学习之旅吧。

## 好了，开始你的学习吧

- 请点击以下链接，来记录一个你开始学习的时间：[Start time](https://timer.metanchor.net). 这些数据，也将以Web3.0的方式部署到测试网络上，同时，我们会向您生成的账号中分发 500 coins，供接下来的测试之用。

- 注意，如果你新建了一个Anchor网络账号的话，请记录下Seed，这是获取账号权限的唯一方式，如果失去了这个账号，你也将失去和这个账号关联的所有Web3.0的资源。

- 在开始之前，再次明确下Anchor的重要特点，它是一个链上链表，可以通过唯一的Anchor Name来访问。

## 开发环境的准备

- 俗话说，工欲善其事必先利其器，要开始Anchor的开发工作，需要准备2个工具:开发IDE和必须的库。IDE使用您喜欢的就行，下面重点说说需要的JS库，主要有2个：**@polkadot/api**和**anchorJS**.
    1. @polkadot/api,连接到substrate节点的官方JS库，使用websocket的方式，连接到Substrate的节点，实现各种数据读取。同时，也能创建账号，解析加密的签名文件等基础功能。
    2. anchorJS, Anchor网络数据的读写JS库，实现对Anchor的查看、历史查询、写入等操作。
    3. jquery, 基础的JS库，方便操作Dom。

- 那我们就开始教程吧，这将是一个从零开始的前端页面显示。这个教程主要是说明Anchor的读写操作的，未了避免引入其他前端框架带来的不确定性，采用了下载 **@polkadot/api** 和 **anchorJS**来使用。下载链接如下：
    1. [@polkadot/api下载](http://download.metanchor.net)
    2. [anchorJS下载](http://download.metanchor.net)
    3. [jquery下载](http://download.metanchor.net)

- 好了，你所需要的所有材料都有了，让我们开始编码吧

## 开始你的Web3.0开发之旅

- 第1步，建立一个文件夹，把下载的3个JS库文件都放进去。

- 第2步，建立一个index.html的空文件，然后把下面的代码写进去。

    ```HTML
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <style>
                    body{}
                </style>
                <script src="polkadot.min.js"></script>
                <script src="anchorJS.min.js"></script>
                <script>
                    $(function(){
                        //需要修改的内容
                        var seed="{{seed}}";
                        var data="{{data}}";
                        var name="{{name}}";

                        //基本参数
                        var server="wss://dev.metanchor.net";
                    });
                </script>
            </head>
            <body>
                <h2></h2>
                <h4></h4>
            </body>
        </html>
    ```

- 第3步，修改上面文件里的几个参数
    1. Seed的修改，请在index.html里搜索到`{{seed}}`。这个Seed就是在 [好了，开始你的学习吧](#tag) 那里创建账号时候的Seed。
    2. Anchor Name的修改。这个Name，也是在 [好了，开始你的学习吧](#tag) 那里获取的随机Anchor Name
    3. Data的修改。请在这里写入任何你想写入的数据。

- 第4步，运行这个html文件。你需要做的就是双击这个文件，或者，将这个文件拖放到浏览器（例如，Chrome）里。

- 第5步，等待页面显示为Successful的时候，数据就已经写入成功了。是时候检查这个结果了。

- 第6步，是时候检查胜利成果了。可以通过一下几种方式来看看你在Web3.0上写下的第一份数据。

## 初探Web3.0开发之后





## 如何运行快速的本地模拟器

## 最后，需要您记录下这次学习的结果

- 请点击以下链接，来记录一个你结束学习的时间：[Start time](). 谢谢您的参与，很高兴的告诉你，你已经跨过了Web3.0开发的门槛。

- 你也许会有以下的疑问

    1. 如何获取**hello**的历史数据？
    2. `Protocol`字段有啥用？

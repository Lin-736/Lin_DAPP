## 如何运行

补充如何完整运行你的应用。

1. 在本地启动ganache应用。

2. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```
3. 将合约部署到ganache上，同时需要修改hardhat.config.ts的一些数据，修改ganache中url和accounts。

4. 部署后会出现合约的地址，复制，粘贴到contract-addresses.json中Car的位置。

5. 在 `./frontend` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install -D web3
    ```
6. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm start
    ```
7. 运行后将metamask中ganache链上的用户导入进去。

## 功能实现分析

实现了：
> 管理者可以发布汽车。
> 用户可以向管理者领车。
> 在网站中查看自己拥有的汽车列表。查看当前还没有被借用的汽车列表。
> 查询一辆汽车的主人，以及该汽车当前的借用者（如果有）。
> 选择并借用某辆还没有被租借的汽车一定时间。

## 项目运行截图

放一些项目运行截图。

见根目录图片，名称即为效果。

## 备注

此份代码截至提交还有些许bug，且本人非计科学生，初次接触前端相当头大。
12日考完试后还会增加些许完善，助教学长手下留情。

## 参考内容

- 课程的参考Demo：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

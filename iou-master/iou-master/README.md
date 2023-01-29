# **iou**

**Do not push to the master branch**, instead create seperate branches for development, for example `feature-chat`, when features are completed we can then merge the branches as a group to avoid conflicts.

## Running IOU

To run use the command `npm run start` in the root directory.

An `.env` file is needed to hold environment variables, such as database passwords and ports. The `example.env` can be used as a template for the `.env` file.
For database credentials contact George, for `JWT_SECRET` run `openssl rand -base64 33`.

If you have never run it then you will need to run `npm install` in the root directory to install all the dependencies, this will need to be rerun if any dependencies change.

## Installing Node.js

We are using Node.js v16.13.2, there are many ways to install Node.js, you can use whichever one you want. My favourite is `n`, a simple tool for installing and switching Node.js versions.

To install Node.js on the VM (or any Debian/Ubuntu based OS, including Windows Subsystem for Linux) using `n` run the following commands:

```
sudo apt update
sudo apt install npm
sudo npm install -g n
sudo n v16.13.2
hash -r
```

Then the command `node -v` should return the correct version: `v16.13.2`.

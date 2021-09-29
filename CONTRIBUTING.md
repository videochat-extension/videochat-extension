[<sup>Как поучавствовать в разработке Google Chrome расширении для Чат Рулетки?</sup>](https://translate.yandex.ru/translate?lang=en-ru&url=https%3A%2F%2Fgithub.com%2Fqrlk%2Fvideochatru-extension%2Fblob%2Fmaster%2FCONTRIBUTING.md)  
# Contributing

**videochatru-extension** is an open source project licensed under the MIT license.

Contributions are welcome although I can't guarantee their quick review.  

If you would like to help, getting started is easy.

## Get Started

1. You must have a github account and be logged in
2. Fork the repo by clicking the "Fork" link on the top-right corner of the page
3. Once the fork is ready, clone to your local PC

   ```sh
   $ git clone https://github.com/<USERNAME>/videochatru-extension.git
   Cloning into 'videochatru-extension'...
    remote: Enumerating objects: 131, done.
    remote: Counting objects: 100% (131/131), done.
    remote: Compressing objects: 100% (91/91), done.
    remote: Total 131 (delta 42), reused 108 (delta 30), pack-reused 0
    Receiving objects: 100% (131/131), 6.89 MiB | 16.87 MiB/s, done.
    Resolving deltas: 100% (42/42), done.
   ```

4. Create a branch for your changes

   ```sh
    $ cd videochatru-extension
    $ git checkout -b bugfix/1-fix-ip-info
    git checkout -b bugfix/1-fix-ip-info
    Switched to a new branch 'bugfix/1-fix-ip-info'
   ```

5. Open the code in your favorite code editor, make your changes

   ```sh
   echo "Awesome changes" > somefile.js
   git add .
   ```

5. Next, open Chrome/Brave/Chromium and enable developer mode via
   `Settings > Extensions > Manage Extensions` and toggle `Developer mode` in
   the top-right corner.
6. Click `Load unpacked` and browse to the folder you cloned src to.
7. Try out your changes, make sure they work as expected
8. Commit and push your changes to github

   ```sh
   git commit -m "Awesome description of some awesome changes."
   git push
   ```

9. Open your branch up on the github website then click `New pull request` and
    write up a description of your changes.

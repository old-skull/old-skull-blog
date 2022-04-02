_11-08-2021_

[#vscode](tags/vscode)

# VSCode inline hints

With Typescript 4.4 you can finally use inline hints in VSCode. I think this is one of the most requested features.

![](img/3/3-1.png)

All features and settings are listed [here](https://github.com/microsoft/vscode/issues/16221#issuecomment-879538951). Also, be sure that you are using VSCode insiders or wait until the next release of the "vanilla" VSCode.

To enable this feature, you should configure your **settings.json** with the following settings:

```json
{
  "editor.inlayHints.enabled": true
}
```

You could also change the font family and font size:

```json
{
  "editor.inlayHints.fontFamily": "Fira Code",
  "editor.inlayHints.fontSize": 20
}
```

I'm not a big fan of things like that. But I know a lot of people are struggling after switching from WebStorm or Rider.

Enjoy!

## Links

- [Github issue](https://github.com/microsoft/vscode/issues/16221)
- [Issue comment with config and example](https://github.com/microsoft/vscode/issues/16221#issuecomment-879538951)
- [VSCode iteration plan for July 2021](https://github.com/microsoft/vscode/issues/128444)

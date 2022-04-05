_04-08-2021_

[#pnpm](tags/pnpm) [#monorepo](tags/monorepo)

# How to set up monorepo using PNPM

## Install pnpm (optional)

```bash
npm install -g pnpm
```

## Initialize project

```bash
pnpm init
```

After you add basic files like .gitignore, README.md you should create a **packages** folder. Every folder inside **packages** is an npm package with its configuration. Feel free to add as many packages as you want.

<pre><code class="language-treeview">./
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── packages/
│   ├── backend/
│   ├── frontend/
│   ├── types/
└── └── ...your package.../
</code></pre>

## Configure monorepo

The first file is a **pnpm-workspace.yaml**. This file allows us to configure our packages directory. Here you can change your source folder. I will stick to the **packages**.

```yml
packages:
  - 'packages/**'
```

And the second file will help us to configure relations between our packages.
So we need to create **.npmrc** with the following options:

```js
shared-workspace-shrinkwrap = true
link-workspace-packages = true
```

Let's see why we need these options.

**shared-workspace-shrinkwrap** - tells pnpm to create a single pnpm-lock.yaml (package-lock.json alternative) file for all our dependencies in the root of the workspace.

**link-workspace-packages** - links locally available packages from monorepo into node_modules instead of re-downloading them from the registry.

## Review

<pre><code class="language-treeview">./
├── .gitignore
├── .npmrc
├── LICENSE
├── README.md
├── package.json
├── packages/
│   ├── backend/
│   ├── frontend/
│   └── types/
└── pnpm-workspace.yaml
</code></pre>

After all these steps you will be able to use monorepo. Every dependency that you add will be linked to the nearest package or the project root. Just use <code class="language-inline">pnpm add</code> command.

## Links

- [PNPM website](https://pnpm.io/)
- [Github example](https://github.com/old-skull/pnpm-monorepo-starter-kit)

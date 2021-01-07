#!/usr/bin/env bash
##################################################
# This shell script is executed by nx-release.js #
##################################################

NX_VERSION=$1

if [[ $NX_VERSION == "--local" ]]; then
    NX_VERSION="*"
fi

npx nx run-many --target=build --all --parallel || { echo 'Build failed' ; exit 1; }

cd dist/packages

#if [[ "$OSTYPE" == "darwin"* ]]; then
#    sed -i "" "s|\*|$NX_VERSION|g" {react,next,web,jest,node,express,nest,cypress,storybook,angular,workspace,cli,linter,tao,devkit,eslint-plugin-nx,create-nx-workspace,create-nx-plugin,nx-plugin}/package.json
#else
#    sed -i "s|\*|$NX_VERSION|g" {react,next,web,jest,node,express,nest,cypress,storybook,angular,workspace,cli,linter,tao,devkit,eslint-plugin-nx,create-nx-workspace,create-nx-plugin,nx-plugin}/package.json
#fi

if [[ $NX_VERSION == "*" ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -E -i "" "s|\"@nxext\/([^\"]+)\": \"\\*\"|\"@nxext\/\1\": \"file:$PWD\/\1\"|" {stencil,svelte,tailwind}/package.json
    else
    echo $PWD
        sed -E -i "s|\"@nxext\/([^\"]+)\": \"\\*\"|\"@nxext\/\1\": \"file:$PWD\/\1\"|" {stencil,svelte,tailwind}/package.json
    fi
fi

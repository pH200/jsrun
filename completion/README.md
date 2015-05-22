# Completion for justrun
> Thanks to grunt team and Tyler Kellen

To enable tasks auto-completion in shell you should add `eval "$(justrun --completion=shell)"` in your `.shellrc` file.

## Bash

Add `eval "$(justrun --completion=bash)"` to `~/.bashrc`.

## Zsh

Add `eval "$(justrun --completion=zsh)"` to `~/.zshrc`.

## Powershell

Add `Invoke-Expression ((justrun --completion=powershell) -join [System.Environment]::NewLine)` to `$PROFILE`.

## Fish

Add `justrun --completion=fish | source` to `~/.config/fish/config.fish`.

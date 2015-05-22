# Completion for jsrun
> Thanks to grunt team and Tyler Kellen

To enable tasks auto-completion in shell you should add `eval "$(jsrun --completion=shell)"` in your `.shellrc` file.

## Bash

Add `eval "$(jsrun --completion=bash)"` to `~/.bashrc`.

## Zsh

Add `eval "$(jsrun --completion=zsh)"` to `~/.zshrc`.

## Powershell

Add `Invoke-Expression ((jsrun --completion=powershell) -join [System.Environment]::NewLine)` to `$PROFILE`.

## Fish

Add `jsrun --completion=fish | source` to `~/.config/fish/config.fish`.

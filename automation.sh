#!/usr/bin/env osascript

on run argv
    if argv's item 1 = "ngrok" then
        my newTab("ngrok start -all")
    else if argv's item 1 = "frontend" then
        my newTab("cd frontend; npm start")
    else if argv's item 1 = "backend" then
        my newTab("cd server; poetry run python main.py")
    end if
end run

-- 新しいタブを開いてコマンドを実行する
on newTab(command)
    -- Open a new tab and wait a little
    tell application "System Events"
        keystroke "t" using command down
        delay 0.5
    end tell

    -- Run the command in the new tab
    tell application "Terminal"
        do script command in front window
    end tell
end newTab

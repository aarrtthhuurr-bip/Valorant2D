Set shell = CreateObject("WScript.Shell")
scriptPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\relogio_commit.bat"
shell.Run """" & scriptPath & """", 0, False

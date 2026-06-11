Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)

shell.Run """" & projectDir & "\start_protocol_shift_server.cmd" & """", 0, False
shell.Run """" & projectDir & "\rodar_escondido.vbs" & """", 0, False

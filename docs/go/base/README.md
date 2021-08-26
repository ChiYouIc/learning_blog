# GO Learning


@startuml
Bob -> Alice : hello
@enduml


@flowstart
cond=>condition: Process?
process=>operation: Process
e=>end: End

cond(yes)->process->e
cond(no)->e
@flowend


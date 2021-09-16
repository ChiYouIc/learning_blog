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

``` mermaid
graph flow
A->> B: Query
B->> C: Forward query
Note right of C: Thinking...
C->> B: Response
B->> A: Forward response
```
``` mermaid
graphTD
Alice->John: Hello John, how are you?
loop every minute
John-->Alice: Great!
end
```

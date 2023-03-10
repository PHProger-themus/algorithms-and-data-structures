type ListNodeOrNull<T> = ListNode<T> | null

class ListNode<T> {
    public next: ListNodeOrNull<T> = null
    public data: T

    constructor(data: T) {
        this.data = data
    }
}

// Реализовывая списки на высокоуровневых языках, можно делать с ними все, что угодно (например извращаться с методом удаления, что я и сделал).
// Вряд ли такое задумывалось изначально...
class List<T> {
    private head: ListNodeOrNull<T> = null

    // Просто добавим элемент в начало, то есть сделаем его головой, и ссылку next зададим как предыдущая голова
    public prepend(node: ListNode<T>): void {
        if (!this.head) {
            this.head = node
        } else {
            node.next = this.head
            this.head = node
        }
    }

    // append не подразумевается для односвязного списка, т.к. это крайне неэффективная операция, нужно итерироваться, чтобы найти ласт ноду
    public append(node: ListNode<T>): void {
        if (!this.head) {
            this.head = node
        } else {
            const lastNode = this.find(n => !n.next)!
            lastNode.next = node
        }
    }

    // Усложнился за счет callback на один уровень вложенности (зачем я его вообще сюда впиндюрил?)
    public delete(nodeOrCallback: ListNode<T> | ((node: ListNode<T>) => boolean)): void {
        if (this.head) {
            const node = nodeOrCallback instanceof ListNode ? nodeOrCallback : this.find(nodeOrCallback)
            if (node) {
                // Если первая нода - просто ставим следующую как голову (или там будет null, если нода одна в списке, что значит, что он очистится)
                if (this.head === node) {
                    this.head = this.head!.next
                } else {
                    // Иначе - ищем предыдущую ноду и меняем ей next.
                    const prevNode = this.find(n => n.next === node)
                    if (prevNode) {
                        prevNode.next = node.next
                        // Удаление ноды должно сопровождаться удалением ее из памяти, но у нас тут высокий уровень, нам можно и так)
                        // На самом деле в TS/JS сборка мусора осуществится автоматически, но на низких уровнях здесь должна быть операция удаления ноды из памяти
                    }
                }
            } 
        }
    }

    // Просто выведу список в виде строки "нода -> нода -> нода". Для дебага.
    public visualize(): string {
        const nodes: T[] = []
        let currNode = this.head
        while (currNode) {
            nodes.push(currNode.data)
            currNode = currNode.next
        }
        return nodes.join(' -> ')
    }

    public size(): number {
        let currNode = this.head
        let size = 0
        while (currNode) {
            size++
            currNode = currNode.next
        }
        return size
    }

    // Поиск при помощи callback. Возможна реализация через поиск по data. Но мне, например, пригодилась данная реализация для создания метода append.
    public find(findCallback: (node: ListNode<T>) => boolean): ListNodeOrNull<T> {
        let currNode = this.head
        while (currNode) {
            if (findCallback(currNode)) {
                return currNode
            }
            currNode = currNode.next
        }
        return null
    }
}

const list = new List<number>()
let secondNode = new ListNode(2)

list.append(new ListNode(1))
list.append(secondNode)
list.prepend(new ListNode(5))
list.append(new ListNode(3))
list.prepend(new ListNode(9))

console.log(list.visualize(), list.size())

list.delete(secondNode)

console.log(list.visualize(), list.size())

console.log(list.find(n => n.data === 5))
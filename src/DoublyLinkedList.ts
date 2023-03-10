// Это двусвязный список. Перед его изучением ознакомьтесь с реализацией односвязного списка, если вы еще этого не сделали.

// Парочка типов, чтобы нам было комфортнее
type ListNodeOrNull<T> = ListNode<T> | null
type Bounds<T> = { head: ListNode<T>, tail: ListNode<T> } | null

class ListNode<T> {
    public next: ListNodeOrNull<T> = null
    // Нода теперь будет хранить ссылку еще и на предыдущий элемент
    public prev: ListNodeOrNull<T> = null
    public data: T

    constructor(data: T) {
        this.data = data
    }
}

// Реализовывая списки на высокоуровневых языках, можно делать с ними все, что угодно (например извращаться с методом удаления, что я и сделал).
// Вряд ли такое задумывалось изначально...
class List<T> {
    // А давайте будем хранить также ссылочку и на "хвост" списка - последний элемент
    // head и tail должны быть в согласованности, они либо оба null, либо оба имеют значения. Об этом можно забыть.
    // Поэтому я ввожу специальный тип Bounds, который следит за этим.
    private bounds: Bounds<T> = null

    // Если bounds не заданы, значит мы добавляем первый элемент. Иначе - смотрим, какой элемент был первым,
    // и делаем его вторым, не забываем поменять обе ссылки
    // Я передаю в функцию ноду, а не данные, которые она должна хранить. Это также не принципиально,
    // можно создавать ноду в методе, передавая ей в конструктор данные
    public prepend(node: ListNode<T>): void {
        if (!this.bounds) {
            this.bounds = { head: node, tail: node }
        } else {
            this.bounds.head.prev = node
            node.next = this.bounds.head
            this.bounds.head = node
        }
    }

    // Аналогично методу выше, только все наоборот
    public append(node: ListNode<T>): void {
        if (!this.bounds) {
            this.bounds = { head: node, tail: node }
        } else {
            this.bounds.tail.next = node
            node.prev = this.bounds.tail
            this.bounds.tail = node
        }
    }

    // Удаление по условию. Находим элемент и меняем ссылки его соседних элементов, теперь они тупо игнорят его :)
    // Можно также передать просто ноду
    public delete(nodeOrCallback: ListNode<T> | ((node: ListNode<T>) => boolean)): void {
        const node = nodeOrCallback instanceof ListNode ? nodeOrCallback : this.find(nodeOrCallback)
        if (node) {
            node.prev && (node.prev.next = node.next)
            node.next && (node.next.prev = node.prev)
        }
    }

    // Я нарочно не реализовываю возврат массива с нодами, так как произойдет закольцевание ссылок. Но реализовать можно, это не сложно.
    public visualize(): string {
        const nodes: T[] = []
        let currNode = this.getHead()
        while (currNode) {
            nodes.push(currNode.data)
            currNode = currNode.next
        }
        return nodes.join(' <-> ')
    }

    public size(): number {
        let currNode = this.getHead()
        let size = 0
        while (currNode) {
            size++
            currNode = currNode.next
        }
        return size
    }

    public find(findCallback: (node: ListNode<T>) => boolean): ListNodeOrNull<T> {
        let currNode = this.getHead()
        while (currNode) {
            if (findCallback(currNode)) {
                return currNode
            }
            currNode = currNode.next
        }
        return null
    }

    // С новым свойством bounds операция теперь немного усложнилась
    private getHead() {
        return this.bounds?.head || null
    }
}

const list = new List<number>()

list.append(new ListNode(1))
list.append(new ListNode(2))
list.append(new ListNode(3))
list.append(new ListNode(4))
list.append(new ListNode(5))

console.log(list.visualize()) // 1 <-> 2 <-> 3 <-> 4 <-> 5

list.delete(node => node.data === 2)

console.log(list.visualize()) // 1 <-> 3 <-> 4 <-> 5
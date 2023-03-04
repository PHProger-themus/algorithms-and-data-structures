class DoublyListNode<T> {
    public next: DoublyListNode<T> | null = null
    public prev: DoublyListNode<T> | null = null
    public data: T

    constructor(data: T) {
        this.data = data
    }
}

class DoublyList<T> {
    private head: DoublyListNode<T> | null = null

    public prepend(node: DoublyListNode<T>): void {
        const prevHead = this.head
        this.head = node
        if (prevHead) {
            this.head.next = prevHead
            prevHead.prev = this.head
        }
    }

    public append(node: DoublyListNode<T>): void {
        if (!this.head) {
            this.head = node
        } else {
            const lastNode = this.find(n => !n.next)!
            lastNode.next = node
            node.prev = lastNode
        }
    }

// Доработать, узел имеет ссылки в обе стороны и не нужен этот бред
    public delete(node: DoublyListNode<T>): void {
        const prevNode = this.find(n => n.next === node)
        if (prevNode) {
            prevNode.next = node.next
            if (node.next) {
                node.next.prev = prevNode
            }
        }
    }

    public size(): number {
        let currNode: DoublyListNode<T> | null = this.head
        let size = 0
        while (currNode) {
            size++
            currNode = currNode.next
        }
        return size
    }

    public find(findCallback: (node: DoublyListNode<T>) => boolean): DoublyListNode<T> | null {
        let currNode: DoublyListNode<T> | null = this.head
        while (currNode) {
            if (findCallback(currNode)) {
                return currNode
            }
            currNode = currNode.next
        }
        return null
    }

    public toArray(): T[] {
        const nodes: T[] = []
        let currNode: DoublyListNode<T> | null = this.head
        while (currNode) {
            nodes.push(currNode.data)
            currNode = currNode.next
        }
        return nodes
    }

    public toString(): string {
        return this.toArray().join(' -> ')
    }
}

let doublyList = new DoublyList<number>()
const doublyNodeThird = new DoublyListNode(3)

doublyList.append(new DoublyListNode(1))
doublyList.append(new DoublyListNode(2))
doublyList.prepend(doublyNodeThird)
doublyList.append(new DoublyListNode(4))
doublyList.prepend(new DoublyListNode(5))

console.log(doublyList.toArray())

doublyList.delete(doublyNodeThird)

console.log(doublyList.toArray())
class ListNode<T> {
    public next: ListNode<T> | null = null
    public data: T

    constructor(data: T) {
        this.data = data
    }
}

class List<T> {
    private head: ListNode<T> | null = null

    public prepend(node: ListNode<T>): void {
        const prevHead = this.head
        this.head = node
        if (prevHead) {
            this.head.next = prevHead
        }
    }

    public append(node: ListNode<T>): void {
        if (!this.head) {
            this.head = node
        } else {
            const lastNode = this.find(n => !n.next)!
            lastNode.next = node
        }
    }

    public delete(node: ListNode<T>): void {
        const prevNode = this.find(n => n.next === node)
        if (prevNode) {
            prevNode.next = node.next
        }
    }

    public visualize(): string {
        const nodes: T[] = []
        let currNode: ListNode<T> | null = this.head
        while (currNode) {
            nodes.push(currNode.data)
            currNode = currNode.next
        }
        return nodes.join(' -> ')
    }

    public size(): number {
        let currNode: ListNode<T> | null = this.head
        let size = 0
        while (currNode) {
            size++
            currNode = currNode.next
        }
        return size
    }

    public find(findCallback: (node: ListNode<T>) => boolean): ListNode<T> | null {
        let currNode: ListNode<T> | null = this.head
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
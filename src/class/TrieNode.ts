export class TrieNode {
  children: Map<string, TrieNode | null>;
  eow: boolean;

  constructor() {
    this.children = new Map();
    this.eow = false;
  }

  addWord(word: string) {
    let currNode: TrieNode = this;

    for (let letter of word) {
      if (currNode.children.get(letter) == null) {
        currNode.children.set(letter, new TrieNode());
      }

      let newNode = currNode.children.get(letter);
      if (newNode != undefined && newNode != null) {
        currNode = newNode;
      }
    }

    currNode.eow = true;
  }
}

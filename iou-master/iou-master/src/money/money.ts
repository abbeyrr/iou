/** 
 * An ID for a person.
 * These should be unique.
 */
export type PersonID = number;

/**
 * A record of a transaction.
 *
 * Invariants:
 * `from` != `to`
 *
 * TODO: The "value" field should also not be type number as it is money.
 */
export class Transaction {
    public readonly from: PersonID;
    public readonly to: PersonID;
    public readonly value: number;

    /**
     * Creates a new transaction.
     * @param from The sender of the amount.
     * @param to The recipient of the amount.
     * @param value The amount of money to send.
     * @throws If `from == to`.
     */
    constructor(from: PersonID, to: PersonID, value: number) {
        if (from == to) {
            throw new Error("sender and recipient of transaction cannot be the same person.");
        }
        this.from = from;
        this.to = to;
        this.value = value;
    }

    /**
     * Checks if the {@link PersonID} is involved in the transaction.
     * @param id The ID to check.
     * @returns `true` if the person is either the sender or the recipient in the transaction.
     */
    public involves(id: PersonID): boolean {
        return this.from === id || this.to === id;
    }
}

/** A Container of all the transactions from other people to `owner`. */
export class Pot {
    public readonly owner: PersonID;
    private map: Map<PersonID, number> = new Map();

    /**
     * Creates a new {@link Pot} owned by a Person.
     * @param owner The owner of the {@link Pot}.
     */
    constructor(owner: PersonID) {
        this.owner = owner;
    }

    /**
     * Adds a partial transaction to the {@link Pot}.
     * @param person The person on the other end of the transaction.
     * @param amount The amount of money sent.
     */
    public add(person: PersonID, amount: number) {
        const value = this.get(person);
        this.map.set(person, value + amount);
    }

    /**
     * Gets the value associated with the {@link person} in the {@link Pot}.
     * @param person The person to check for in the {@link Pot}.
     * @returns The amount of money in the pot.
     */
    public get(person: PersonID): number {
        return this.map.get(person) ?? 0;
    }

    /**
     * Calculates the total amount of money in the {@link Pot}.
     * @returns The total value of the {@link Pot}.
     */
    public total(): number {
        let t = 0;
        this.map.forEach((v, _) => {
            t += v;
        });
        return t;
    }
}

/**
 * Contains a record of all transactions ever made.
 * Just uses an array of transactions for now.
 */
export class Ledger {
    private people: Set<PersonID> = new Set();
    private transactions: Array<Transaction> = new Array();

    /**
     * Creates an empty {@link Ledger}.
     *
     * You must {@link register} new people before adding any transactions.
     */
    constructor() { }

    /**
     * Registers a new {@link Person} to the ledger.
     * @param p The {@link Person} to register.
     */
    public register(p: Person) {
        this.people.add(p.id);
    }

    /** 
     * Gets the length of the list of transactions in the {@link Ledger}.
     * @returns Length of the list.
     */
    public get length(): number {
        return this.transactions.length;
    }

    /** 
     * Gets the number of members of the {@link Ledger}.
     * @returns The amount of people registered to the {@link Ledger}.
     */
    public get members(): Set<PersonID> {
        return this.people;
    }

    /** 
     * Gets the list of transactions of the {@link Ledger}.
     * @returns The internal transaction list.
     */
    public get list(): Array<Transaction> {
        return this.transactions;
    }

    /**
     * Add a new transaction to the bottom of the ledger.
     * @param transaction The {@link Transaction} to add.
     */
    public push(transaction: Transaction): void | Error {
        const allowed = this.people.has(transaction.from) && this.people.has(transaction.to);
        if (!allowed) {
            return new Error("transaction contains people unknown to this ledger, register them first");
        }
        this.transactions.push(transaction);
    }

    /**
     * Creates a {@link Pot} of money for the given person.
     * @param id The ID of the Person the {@link Pot} is associated with.
     * @returns A {@link Pot} containing all money given or sent by {@link id}.
     */
    public pot(id: PersonID): Pot {
        let pot = new Pot(id);
        for (const [other, amount] of this.transactions_of(id)) {
            pot.add(other, amount);
        }
        return pot;
    }

    /**
     * Reduces the ledger's transactions in-place using {@link reduced}.
     */
    public reduce() {
        this.transactions = this.reduced();
    }

    /**
     * Reduces the list of transactions in the ledger.
     * @returns A simpler transaction list.
     */
    public reduced(): Array<Transaction> {
        // this works because sum(pos) + sum(neg) == 0;
        let transactions = new Array<Transaction>();

        let pos = new Array<[PersonID, number]>();
        let neg = new Array<[PersonID, number]>();

        for (const p of this.people) {
            let t = this.pot(p).total();
            if (t > 0) {
                pos.push([p, t]);
            } else if (t == 0) {
                // not involved, skip them
                continue;
            } else {
                // t must be positive so comparisons work
                neg.push([p, -t]);
            }
        }

        // each person in the positive gives to negative until they run out.

        let a = pos.pop();
        if (a == undefined) { return transactions; }
        let [aID, aVal] = a;

        let b = neg.pop();
        if (b == undefined) { return transactions; }
        let [bID, bVal] = b;

        while (true) {
            if (aVal > bVal) {
                // a can cover b's full cost
                transactions.push(new Transaction(aID, bID, bVal));
                aVal -= bVal; // remove b's cost from a
                // advance to the next debter
                b = neg.pop();
                if (b == undefined) break;
                [bID, bVal] = b;
            } else if (bVal > aVal) {
                // a can't cover b's cost
                transactions.push(new Transaction(aID, bID, aVal));
                bVal -= aVal; // remove a's contribution
                // advance to the next crediter
                a = pos.pop();
                if (a == undefined) break;
                [aID, aVal] = a;
            } else {
                // a and b's cost are the same
                transactions.push(new Transaction(aID, bID, aVal));
                // move onto the next two people
                a = pos.pop();
                if (a == undefined) break;
                [aID, aVal] = a;
                b = neg.pop();
                if (b == undefined) break;
                [bID, bVal] = b;
            }
        }

        return transactions;
    }

    /** @private A generator for all transactions involving the person. */
    private * transactions_of(id: PersonID) {
        for (const ts of this.transactions) {
            if (!ts.involves(id)) {
                continue;
            }
            let x: [PersonID, number];
            if (ts.from === id) {
                // sending
                x = [ts.to, -ts.value];
            } else {
                // recieving
                x = [ts.from, ts.value];
            }
            yield x;
        }
    }
}

export interface PayParams {
    amount: number,
    to: Person,
}

/**
 * Represents a person in a house.
 * Currently contains a bunch of convience functions for a better API.
 * 
 * They have a unique ID to differentiate themselves.
 */
export class Person {
    public readonly id: PersonID;

    constructor(id: PersonID) {
        this.id = id;
    }

    public pay({ amount, to }: PayParams): Transaction | Error {
        if (this.id !== to.id) {
            return new Transaction(this.id, to.id, amount);
        } else {
            return new Error("cannot pay yourself money");
        }
    }

    public pot(ledger: Ledger): Pot {
        return ledger.pot(this.id);
    }

    public balance(ledger: Ledger): number {
        return ledger.pot(this.id).total();
    }
}

import { Transaction, Person } from './money';
import * as money from './money';

class PersonFactory {
    constructor() {
        this.next_id = 0;
    }
    person() {
        return new money.Person(this.next_id++);
    }
}

test('money api', () => {
    let factory = new PersonFactory();
    let ledger = new money.Ledger();

    expect(ledger.length).toBe(0);
    expect(ledger.members.size).toBe(0);

    // makes and registers a new person
    let p = () => {
        let p = factory.person();
        ledger.register(p);
        return p;
    };

    let a = p();
    let b = p();
    let c = p();
    let d = p();
    let e = p();
    let f = p();

    // we added 6 new people
    expect(ledger.members.size).toBe(6);

    // if we attempt to add someone already registered,
    // the length shouldn't change
    ledger.register(a);
    expect(ledger.members.size).toBe(6);

    // pay amount a -> b
    let pay = (a, b, amount) => {
        if (a instanceof Person && b instanceof Person) {
            let t = a.pay({ amount, to: b });
            if (t instanceof Transaction)
                ledger.push(t);
        }
    };

    // cant pay money to yourself!
    expect(() => new Transaction(a.id, a.id, 5)).toThrow();

    // test scenario
    pay(a, c, 5);
    pay(d, c, 7);
    pay(c, a, 5);
    pay(f, b, 2);
    pay(b, c, 3);
    pay(f, a, 20);
    pay(d, c, 3);
    pay(d, f, 5);
    pay(c, f, 3);

    let reduced = ledger.reduced();
    expect(reduced.length).toBeLessThan(ledger.length);
});

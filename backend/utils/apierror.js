class apierror extends Error {
  constructor(statuscode, data = null, message = "", errors = [], stack) {
    super(message);

    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = false;
    Object.defineProperty(this, "message", {
      value: message,
      enumerable: true, // 👈 ensures JSON.stringify() includes it
      writable: true,
    });
    // this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { apierror };

/*

class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 👈 calls Animal's constructor
    this.breed = breed;
  }
}

const d = new Dog("Buddy", "Golden Retriever");
console.log(d); // Dog { name: 'Buddy', breed: 'Golden Retriever' }
If you don’t call super() inside the constructor of a subclass, JavaScript throws an error:

❌ Must call super constructor before accessing 'this' or returning from derived constructor.
*/

class CircuitBreaker {

  constructor() {

    this.failures = 0;

    this.threshold = 5;

    this.open = false;

  }

  async execute(callback) {

    if (this.open) {

      throw new Error(
        'Circuit breaker active'
      );

    }

    try {

      const result =
        await callback();

      this.failures = 0;

      return result;

    } catch (err) {

      this.failures++;

      if (
        this.failures >=
        this.threshold
      ) {

        this.open = true;

      }

      throw err;

    }

  }

}

module.exports =
new CircuitBreaker();

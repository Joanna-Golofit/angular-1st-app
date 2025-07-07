// Demonstracja: Stub vs prawdziwe HTTP
const { stub } = require("sinon");
const { of } = require("rxjs");

console.log("=== DEMONSTRACJA: Stub vs prawdziwe HTTP ===\n");

// 1. Prawdziwe HTTP (gdybyśmy to robili)
console.log("1. Prawdziwe HTTP wyglądałoby tak:");
console.log('   fetch("https://api.example.com/data")');
console.log("   - Wysyła request przez internet");
console.log("   - Czeka na odpowiedź serwera");
console.log("   - Może się nie powieść\n");

// 2. Stub HTTP (to co robimy w teście)
console.log("2. Stub HTTP (nasz test):");
const httpStub = {
  get: stub().returns(
    of({
      result: true,
      data: [{ id: 1, role: "Admin" }],
    })
  ),
};

console.log("   httpStub.get() wywołane...");
const result = httpStub.get("/api/test");
console.log("   ✅ Natychmiast zwraca:", result);
console.log("   ✅ Żadne HTTP nie zostało wysłane");
console.log("   ✅ Stub.calledOnce:", httpStub.get.calledOnce);
console.log("   ✅ Stub.calledWith:", httpStub.get.calledWith("/api/test"));

// 3. Dlaczego musimy wywołać getAllRoles()?
console.log("\n3. Dlaczego musimy wywołać getAllRoles()?");
console.log("   - Żeby przetestować LOGIKĘ biznesową");
console.log("   - Żeby sprawdzić czy dane są poprawnie przetworzone");
console.log("   - Żeby sprawdzić czy isLoading jest ustawione");
console.log("   - Żeby sprawdzić czy roleList jest wypełnione");

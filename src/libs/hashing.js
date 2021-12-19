const hashByCrypto = (algo, str) => {
  return crypto.subtle
    .digest(algo, new TextEncoder("utf-8").encode(str))
    .then((buf) => {
      return Array.prototype.map
        .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    });
};

//hashAsync("SHA-256", "here_is_my_input_string").then(outputHash => console.log(outputHash));
exports.hashByCrypto = hashByCrypto;
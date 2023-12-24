let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

describe("Cadastro de usuário", () => {
    test("Deve cadastrar um usuário com sucesso", () => {

        let timeNow = Date.now();
        let email =  `${timeNow}@gmail.com`
        let user = {name: "Marcos", email, password: "123"};

        return request.post("/user")
        .send(user)
        .then(res => {

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

        }).catch(error => {
            fail(error);
        })

    })
})
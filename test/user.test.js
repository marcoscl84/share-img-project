let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {name: "Marcos Conte Lima", email: "mcl@mcl.com", password: "123456"}

beforeAll(() => {
    // Inserir um usuário no banco antes de começar o teste
    return request.post("/user").send(mainUser).then(res => {}).catch(error => { console.log(error) })

});

afterAll(() => {
    // Excluir o usuário criado no banco antes de começar o teste
    return request.delete("/user/" + mainUser.email).then(res => {}).catch(error => { console.log(error) })
});

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
    });

    test("Deve impedir que um usuário cadastre com os dados vazios", () => {
        let user = {name: "", email: "", password: ""};

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400);

        }).catch(error => {
            fail(error);
        })
    });

    test("Deve impedir que um usuário cadastre com um e-mail repetido", () => {
        let timeNow = Date.now();
        let email =  `${timeNow}@gmail.com`
        let user = {name: "Marcos", email, password: "123"};

        return request.post("/user")
        .send(user)
        .then(res => {

            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user").send(user).then(res => {
                
                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual("E-mail já cadastrado");

            }).catch(error => {
                
            })

        }).catch(error => {
            fail(error);
        })
    })
});

describe("Autenticação", () => {
    test("Deve retornar um token quando logar", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        }).catch(error => {
            fail(error);
        })
    })

    test("Deve impedir que um usuário não cadastrado se logue", () => {
        return request.post("/auth")
        .send({email: "umemailquenaoexiste@blablabla", password: "umasenhaqualquer"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.email).toEqual("E-mail não cadastrado");
        }).catch(error => {
            fail(error);
        })
    }, 30000)

    test("Deve impedir que um usuário se logue com uma senha errada", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: "senhaerrada"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.password).toEqual("Senha incorreta...");
        }).catch(error => {
            fail(error);
        })
    }, 30000)
})
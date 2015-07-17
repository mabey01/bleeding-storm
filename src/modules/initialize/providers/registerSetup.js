/**
 * Created by Maximilian on 16.05.2015.
 */

moduleInitialize.provider('Initialize.registerSetup', ['Core.taskManagerProvider', function (taskManager) {

    let registers = {};
    let injector = null;

    function getCycleNumber(register) {
        let maxCycleNumber = -1;
        let dependencies = [];

        if ('dependencies' in register) {
            for (let dependencyKey in register.dependencies) {
                let dependencyName = register.dependencies[dependencyKey];
                if (dependencyName in registers) dependencies.push(dependencyName);
            }
        }

        if ('parentRegister' in register) {
            let parentRegisterName = register.parentRegister;
            if (parentRegisterName in registers) dependencies.push(parentRegisterName);
        }

        dependencies.forEach((dependencyName) => {
            let dependencyRegister = registers[dependencyName].original;
            maxCycleNumber = Math.max(maxCycleNumber, getCycleNumber(dependencyRegister));
        });

        return maxCycleNumber + 1;
    }

    function createRunCycle(registers) {
        for (let registerName in registers) {
            let registerObject = registers[registerName];
            registerObject.cycleNumber = getCycleNumber(registerObject.original);
        }
    }

    function getDependencies(registerSpec) {
        let dependencyTemplate = {};
        if ('dependencies' in registerSpec) {
            dependencyTemplate = registerSpec.dependencies;
        }

        if (!('ajax' in dependencyTemplate)) dependencyTemplate['ajax'] = 'Myhttp.ajax';

        let providerDependencies = {};
        for (let name in dependencyTemplate) {
            let providerName = dependencyTemplate[name];
            let provider = injector.get(providerName);
            if (provider) providerDependencies[name] = provider;
            else console.error('Could not find', providerName);
        }

        return providerDependencies;
    }

    function getPrototype(registerSpec) {
        let registerPrototype = {};
        if (registerSpec.parentRegister) {
            registerPrototype = registers[registerSpec.parentRegister].register;
        } else {
            let registerFactory = injector.get('Initialize.register');
            registerPrototype = registerFactory.construct();
        }

        return registerPrototype;
    }

    function initRegister(registerObject) {
        console.log("INIT RGEISTER " + registerObject.original.name);

        if (registerObject.isInitialized) return registerObject.register;

        let register = registerObject.original;
        let target = registerObject.register;
        let dependencies = getDependencies(register);

        delete register['dependencies'];

        let registerPrototype = getPrototype(register);

        Object.setPrototypeOf(target, registerPrototype);
        Object.assign(target, register, dependencies);

        registerObject.isInitialized = true;
    }

    function bootstrapRegister(registerObject) {
        console.log("SETUP RGEISTER " + registerObject.original.name);
        if (!registerObject.isInitialized) throw new Error('register is not initialized!');
        if (registerObject.isBootstraped) return;

        let original = registerObject.original;
        let register = registerObject.register;
        if ('bootstrap' in original || 'bootstrapURL' in original) {
            return Promise.resolve(register.bootstrap()).then(() => {
                registerObject.isBootstraped = true;
            })
        }

        registerObject.isBootstraped = true;
    }

    function runCycle(registers, runFunction, cycleNumber = 0) {
        if (!angular.isFunction(runFunction)) return Promise.reject("parameter runFunction is not a function");

        let runningRegisters = [];
        for (let registerName in registers) {
            let register = registers[registerName];

            if ("cycleNumber" in register) {
                if (register.cycleNumber == cycleNumber) {
                    runningRegisters.push(register);
                }
            }
        }

        if (runningRegisters.length <= 0) return Promise.resolve();

        let runningPromiseArray = runningRegisters.map(runFunction);
        return Promise.all(runningPromiseArray)
            .then(runCycle.bind(this, registers, runFunction, cycleNumber + 1));
    }

    let provider = {
        register(register) {
            if (!register) return console.error('missing register object');

            let name = register.name;
            if (!name) {
                return console.error('register does not have a name');
            }

            if (name in registers) return console.error(`a register with that name (${name}) has already been registerd`);

            let target = {};
            registers[name] = {
                "register" : target,
                "original" : register,
                "isInitialized" : false,
                "isBootstraped" : false,
                "cycleNumber" : Number.POSITIVE_INFINITY
            };
            return target;
        },

        initializeRegisters() {
            createRunCycle(registers);
            return runCycle(registers, initRegister);
        },

        setupRegisters() {
            return runCycle(registers, bootstrapRegister);
        },

        terminateRegisters() {
            return runCycle(registers, (registerObject) => {
                registerObject.register.terminate();
                registerObject.isBootstraped = false;
            })
        }
    };

    Object.assign(this, provider);

    taskManager.on('unauthorized', function() {
        return runCycle(registers, (registerObject) => {
            registerObject.register.terminate();
            registerObject.isBootstraped = false;
        })
    });

    this.$get = ['$injector', function (_injector) {
        injector = _injector;
        return provider;
    }];
}]);

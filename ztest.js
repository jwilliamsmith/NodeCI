const current_factory = (id) => {
    const sensors = {
      "ready": {
            "location": "78",
            "isDeployed": true,
            "sensor_config": {
                "onPipe": true,
                "pipeSize": "3qtr_in",
                "pipeMaterial": "Copper",
                "sensorLocation": "Alternative Location: 3/4\" Output of HWH"
            }
        },
        "offPipe": {
            "location": "78",
            "isDeployed": true,
            "sensor_config": {
                "onPipe": false,
                "pipeSize": "3qtr_in",
                "pipeMaterial": "Copper",
                "sensorLocation": "Alternative Location: 3/4\" Output of HWH"
            }
        }, 
        "notDeployed": {
            "location": "78",
            "isDeployed": false,
            "sensor_config": {
                "onPipe": false,
                "pipeSize": "3qtr_in",
                "pipeMaterial": "Copper",
                "sensorLocation": "Alternative Location: 3/4\" Output of HWH"
            }
        },
        "noPipeSize": {
            "location": "78",
            "isDeployed": true,
            "sensor_config": {
                "onPipd": true,
                "pipeMaterial": "Copper",
                "sensorLocation": "Alternative Location: 3/4\" Output of HWH"
            }
        },
        "new": {
            "isDeployed": false,
        },
        "noParams": null
    }
    return sensors[id];
}

const test_params = {
    "location": "78",
    "isDeployed": true,
    "sensor_config": {
        "onPipe": true,
        "pipeSize": "3qtr_in",
        "pipeMaterial": "Copper",
        "sensorLocation": "Alternative Location: 3/4\" Output of HWH"
    }
}

function check_for_event(device_id, new_params) {
    const new_deployment = (params) => {
        return !params || !params.isDeployed
    }
    const validate = (params) => {
        if (!params || !params.sensor_config) return false;
        const {isDeployed, location} = params;
        const {onPipe, pipeSize, pipeMaterial} = params.sensor_config;
        result = [isDeployed, location, onPipe, pipeSize, pipeMaterial].every(val => val);
        return result;
    };
    const changed = (current_params, new_params) => {
        const check = ['isDeployed', 'location', 'onPipe', 'pipeSize', 'pipeMaterial']
        const flatten = (params) => {
            return params ? { location: params.location, ...params.sensor_config } : null;
        }
        const cpf = flatten(current_params);
        const npf = flatten(new_params);
        return cpf && npf &&
            !check.map(prop => cpf[prop] === npf[prop]).every(val => val);
    }

    current_params = current_factory(device_id);
    if (new_deployment(current_params) && validate(new_params)) return 'initialize';
    if (changed(current_params, new_params)) return 'changed';
    return false;
}


console.log('Ready ', check_for_event('ready', test_params));
console.log('Not on Pipe ', check_for_event('offPipe', test_params));
console.log('Is deployed false ', check_for_event('notDeployed', test_params));
console.log('No pipe size ', check_for_event('noPipeSize', test_params));
console.log('New sensor ', check_for_event('new', test_params));
console.log('Null params ', check_for_event('noParams', test_params));
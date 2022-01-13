module.exports = class GenericCommand {
    constructor(execute, props) {
        this.execute = execute;
        this.props = Object.assign({
            usage: props.name,
            cooldown: 1,
            cooldownMessage: (secondsLeft) => { return `Please wait ${secondsLeft} seconds before using this command.`; },
            requiredPerms: ["SEND_MESSAGES"],
        }, props);
    }
}


const BaseAbility = require('./baseability.js');

class DuplicateUniqueAction extends BaseAbility {
    constructor() {
        super({ cost: null });
        this.title = 'DuplicateUniqueAction';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'dynasty' &&
            !source.facedown &&
            source.getType() === 'character' &&
            (player.isCardInPlayableLocation(context.source, 'dynasty') || player.isCardInPlayableLocation(context.source, 'hand')) &&
            !player.canPutIntoPlay(source) &&
            player.canInitiateAction
        );
    }
    
    executeHandler(context) {
        let duplicate = context.player.getDuplicateInPlay(context.source);
        duplicate.modifyFate(1);
        
        let location = context.source.location;
        context.player.moveCard(context.source, context.source.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
        if(['province 1', 'province 2', 'province 3', 'province 4'].includes(location)) {
            context.player.replaceDynastyCard(location);
        }
        
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source.name);
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DuplicateUniqueAction;


const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class TogashiKazue extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play Togashi Kazue as an attachment',
            condition: () => {
                let clone = new TogashiKazue(this.owner, this.cardData);
                clone.type = 'attachment';
                return this.controller.fate >= this.controller.getReducedCost('play', clone);
            },
            location: 'hand',
            printedAbility: false,
            cannotBeCopied: true,
            handler: () => {
                this.type = 'attachment';
                let context = {
                    game: this.game,
                    player: this.controller,
                    source: this
                };
                this.game.resolveAbility(new PlayAttachmentAction(), context);
                this.game.markActionAsTaken(); // both this ability and resolving the action ability above mark the action as taken, so give priority to the other player
            }
        });
        this.grantedAbilityLimits = {};
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                title: 'Steal a fate',
                condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this.parent),
                printedAbility: false,
                target: {
                    activePromptTitle: 'Choose a character',
                    cardType: 'character',
                    cardCondition: card => this.game.currentConflict.isParticipating(card) && card.fate > 0 && card !== this.parent
                },
                handler: context => {
                    context.target.modifyFate(-1);
                    this.parent.modifyFate(1);
                    this.game.addMessage('{0} uses Togashi Kazue to steal a fate from {1} and place it on {2}', this.controller, context.target, this.parent);
                }
            })
        });
    }

    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;

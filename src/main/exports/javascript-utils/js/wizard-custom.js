define([
    'backbone',
    'underscore',
    'text!js-utils/templates/wizard/wizard.html',
    'jquery-steps'
], function(Backbone, _, template) {

    return Backbone.View.extend({

        template: _.template(template),

        initialize: function(options){
            _.bindAll(this, 'handleStepChange');

            if (options.template) {
                this.template = options.template;
            }

            this.strings = options.strings;
            this.steps = options.steps;
            this.renderOptions = options.renderOptions;

            this.wizardOptions = _.defaults(options.wizardOptions, {
                onStepChanging: this.handleStepChange,
                labels: {
                    finish: this.strings.last,
                    next: this.strings.next,
                    previous: this.strings.prev
                }
            });
        },

        render: function(){
            this.$el.html(this.template({
                renderOptions: this.renderOptions,
                steps: this.steps,
                strings: this.strings
            }));

            this.$wizard = this.$('.wizard');

            this.$wizard.steps(this.wizardOptions);

            _.each(this.steps, function(step){
                var options = step.options || {};

                step.view = new step.constructor(_.defaults({
                    el: this.$('.'+ step.class)
                }, options));
            }, this);
        },

        getStep: function(index) {
            return this.steps[index];
        },

        getCurrentStep: function() {
            return this.getStep(this.$wizard.steps('getCurrentIndex'));
        },

        renderActiveStep: function(){
            this.getStepByAttribute({active: true}).view.render();
        },

        getStepByAttribute: function(attributeHash){
            return _.findWhere(this.steps, attributeHash);
        },

        // if you want to override this function you should probably call this as the first line of your function
        handleStepChange: function(e, currentIndex, newIndex, renderOptions) {
            var newStep = this.getStep(newIndex);

            if(newStep.view.$el.children().length === 0){
                newStep.view.render(renderOptions);
            }
        }
    });
});
Ext.define('CustomFieldsInventory', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function () {
        Ext.create('Rally.data.wsapi.Store', {
            model: 'TypeDefinition',
            fetch: ['Attributes', 'DisplayName'],
            filters: [
                Rally.data.wsapi.Filter.or(
                    _.map(['Defect', 'Defect Suite',
                        'Test Case', 'Test Case Result',
                        'Hierarchical Requirement', 'Portfolio Item',
                        'Task'], function (name) {
                        return {
                            property: 'Name',
                            value: name
                        };
                    })
                )
            ],
            sorters: [{property: 'Name'}]
        }).load().then({
            success: this._onTypeDefsLoaded,
            scope: this
        });
    },

    _onTypeDefsLoaded: function (typeDefs) {
        _.each(typeDefs, function (typeDef) {
            this.add({
                xtype: 'rallygrid',
                margin: '20px',
                title: typeDef.get('DisplayName'),
                showRowActionsColumn: false,
                store: typeDef.getCollection('Attributes', {
                    fetch: ['Name', 'CreationDate', 'Type', 'Required', 'Hidden'],
                    filters: [{property: 'Custom', value: true}],
                    pageSize: 10,
                    sorters: [{property: 'CreationDate', direction: 'DESC'}]
                }),
                columnCfgs: [
                    'Name',
                    'CreationDate',
                    'Type',
                    'Required',
                    'Hidden'
                ],
                pagingToolbarCfg: {
                    pageSizes: [10, 25, 50]
                }
            });
        }, this);
    }
});

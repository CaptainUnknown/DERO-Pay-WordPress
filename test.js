wp.blocks.registerBlockType('derorpc/gateway', {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: 'common',
    edit: () => {
        return wp.element.createElement('h3', null, 'DERO Payment Gateway Configuration');
    },
    save: () => {
        return wp.element.createElement('h3', null, 'Purchase with DERO');
    }
})
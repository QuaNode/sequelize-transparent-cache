const cache = require('../cache')

function classMethods (client, model) {
  return {
    client () {
      return client
    },
    create () {
      return model.create.apply(model, arguments)
      .then(instance => {
        return cache.save(client, instance)
      })
    },
    findById (id) {
      return cache.get(client, model, id)
      .then(instance => {
        if (instance) {
          return instance
        }

        return model.findById.apply(model, arguments)
        .then(instance => cache.save(client, instance))
      })
    },
    findAll (query) {
      var id = JSON.stringify(query);
      return cache.get(client, model, id)
      .then(instances => {
        if (instances && instances.length > 0) {
          return instances
        }

        return model.findAll.apply(model, arguments)
        .then(instances => cache.save(client, instances, id, model.name))
      })
    },
    findAndCountAll(query) {
      var id = JSON.stringify(query);
      return cache.get(client, model, id)
      .then(result => {
        if (result) {
          return result
        }

        return model.findAndCountAll.apply(model, arguments)
        .then(result => cache.save(client, result, id, model.name))
      })
    },
    upsert (data) {
      return model.upsert.apply(model, arguments).then(created => {
        return cache.save(client, model.build(data))
        .then(() => created)
      })
    },
    insertOrUpdate () {
      return this.upsert.apply(this, arguments)
    }
  }
}

module.exports = classMethods

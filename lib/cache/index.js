const { instanceToData, dataToInstance } = require('./util')

function getInstanceModel (instance) {
  const version = instance.sequelize.Sequelize.version

  /* istanbul ignore next: covered, but depends on installed sequelize version */
  return version.startsWith('4')
    ? instance.constructor
    : instance.Model
}

function save (client, instance, id, name) {
  if (!instance) {
    return instance
  }
  
  const key = ['','']
  if (id && name) {
      
    key = [
      name,
      id
    ]
  } else if (Array.isArray(instance) && instance[0] && instance[0].sequelize && id) {
    
    key = [
      getInstanceModel(instance[0]).name,
      id
    ]
  } else if (instance.sequelize && instance.id) {
   
    key = [
      getInstanceModel(instance).name,
      instance.id
    ]
  } else if (Array.isArray(instance.rows) && instance.rows[0] && instance.rows[0].sequelize && id) {
    
    key = [
      getInstanceModel(instance.rows[0]).name,
      id
    ]
  }
  
  return client.set(key, instanceToData(instance)).then(() => instance)
}

function get (client, model, id) {
  const key = [
    model.name,
    id
  ]

  return client.get(key).then(data => {
    return dataToInstance(model, data)
  })
}

function destroy (client, instance) {
  if (!instance) {
    return instance
  }

  const key = [
    getInstanceModel(instance).name,
    instance.id
  ]

  return client.del(key)
}

module.exports = {
  save,
  get,
  destroy
}

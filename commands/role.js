module.exports = {

  active : true,

  name : 'role',
  short : 'r',
  title : 'Вывод списка команд',
  text : 'Возвращает список доступных команд или описание указанной команды',
  example : '[наименование роли] (ID участника)+',


  /**
   *
   *
   * @param {Message} msg
   * @param {Array}   params Параметры команды
   */
  call : function(msg, params){
    let users = [];
    let role = '';

    for(let i = params.length - 1; i >= 0; i--)
      /^[0-9]+$/.test(params[i])
        ? users.push(params[i])
        : role = params[i] + ' ' + role;

    console.log(role);
    console.log(users);

    // if(role && users) // Проверка на наличие аргументов
    //   return help(); // Вывод help со списком всех игровых ролей
    //
    // if(!checkRole(role)) // Проверка на отсутствие роли
    //   return permission // Проверка прав
    //     ? error() // Вывод ошибки с help и списком всех игровых ролей
    //     : createRole(role); // Создание роли
    //
    // if(!users) // Проверка на отсутствие ID пользователей в аргументах
    //   return giveRole(role); // Выдача роли пользователю команды
    //
    // if(!permission) // Проверка отсутствия прав на выдачу ролей пользователям
    //   return error(); // Вывод ошибки с help и списком всех игровых ролей
    //
    // for(let i = 0; i < users.length; i++) // Перебор указанных ID пользователей
    //   checkRole(users[i], role) // Проверка наличия роли пользователя
    //     ? giveRole(role, users[i]) // Выдача роли пользователю
    //     : removeRole(role, users[i]); // Удаление роли у пользователя
  },

};

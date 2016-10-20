var Todo = React.createClass({

	getInitialState: function() {
		return {
			todos: [],
			text: ''
		   }
		},

		componentWillMount: function() {
    this.firebaseRef = firebase.database().ref('todos');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['key'] = childSnapshot.key;
        items.push(item);
      }.bind(this));

      this.setState({
        todos: items
      });
    }.bind(this));
  },
  
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

		onTxtChange: function(e) {
			this.setState({
				text: e.target.value
			})
		},

		onSubmit: function(e) {
			e.preventDefault();
			 if (this.state.text && this.state.text.trim().length !== 0) {
         this.firebaseRef.push({
         text: this.state.text
      });
      this.setState({
          text: ''
       });
      }
		},

		handleDelete: function(key) {
			var firebaseRef = firebase.database().ref('todos');;
			firebaseRef.child(key).remove();
    },

	render: function() {
		return (
			 <div className="app">
          <h1 className="title">Simple Todo</h1>
          <div id="todolist">
            <form onSubmit={this.onSubmit}>
              <div>
                <input type="text" value={this.state.text} className="form-control" id="add-task" 
                  onChange={this.onTxtChange}/>
              </div>
            </form>
            </div>
             <TodoList todos={this.state.todos} onDelete={this.handleDelete}/>
          </div>
		);

	}
});

var TodoList = React.createClass({
	render: function() {
	var that = this;
	 return (
		<div className="container">
		 {this.props.todos.map(function(todo, id) {
		 	return (
		 			<div className="panel panel-primary" key={id}>
            <div className="panel-heading">{"Task "}{id+ 1}
            <span className="glyphicon glyphicon-remove" id={id}
              onClick={ that.props.onDelete.bind(null, todo['key']) }></span>
            </div>
            <div className="panel-body"><p>{todo.text}</p></div>
						{console.log(todo)}
          </div>

		 	)
		  })
		 }
		</div>
	  )
	}
})

ReactDOM.render(<Todo />, document.getElementById("app"))
var AttendeeList = React.createClass({
  getInitialState: function() {
    return {attendees:[], selecttag:null};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({attendees: data, selecttag:"speaker"});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleTagClick: function(e) {
    this.setState({selecttag: e});
  },
  handleMealClick: function(e) {
    this.setState({meal: e});
  },
  handleAttendeeClick: function(e) {
    this.setState({selectAttendee: e});
  },
  addTag: function(newTag, attendeeIndex) {
      var attendee = this.state.attendees.slice();
      attendee[attendeeIndex].tags.push(newTag);
      this.setState({attendees: attendee});
  },
  removeTag: function(tagIndex, attendeeIndex) {
      var attendee = this.state.attendees.slice();
      attendee[attendeeIndex].tags.splice(tagIndex,1);
      this.setState({attendees: attendee});
  },
  editMeal: function(newMeal, attendeeIndex) {
      var attendee = this.state.attendees.slice();
      attendee[attendeeIndex].meal = newMeal;
      this.setState({attendes: attendee});
  },
  addAttendee: function(data) {
      var newData=this.state.attendees;
      newData.push(data);
      this.setState({attendees: newData});
  },
  render: function() {
         var selecttag = this.state.selecttag;
         var tagclick=this.handleTagClick; 
         var that=this; 
         var x=-1;  
        return ( <div><table className= "table table-striped table-bordered table-hover" style={{width:'800px'}}>
          <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Attending With</th>
                        <th>Tags</th>
                        <th>Meal</th>
                    </tr>
                </thead><tbody>
            {
                this.state.attendees.map(function(attendee) {
                    x++;
                    return <Attendee key={attendee.email} index={x} attendee={attendee} tagcolor={selecttag} tagClick={tagclick} mealClick={that.handleMealClick} mealcolor={that.state.meal} selectAttendee={that.state.selectAttendee} attendeeClick={that.handleAttendeeClick} addTag={that.addTag} removeTag={that.removeTag} editMeal={that.editMeal}/>;
                })
            }
            </tbody></table><NewForm addAttendee={this.addAttendee}/></div>);
            
  }
});

var Attendee = React.createClass({
    
    handleTagClick: function(e) {
    this.props.tagClick(e);
    },
    handleMealClick: function(e) {
      this.props.mealClick(e);
    },
    handleAttendeeClick: function(e) {
      this.props.attendeeClick(e);
    },
    containsAttendingWith: function() {
      for (var i = 0; i < this.props.attendee.attendingWith.length; i++) {
        if (this.props.attendee.attendingWith[i] === this.props.selectAttendee) {
            return true;
        }
      }
    return false;
    },
    addTag: function(newTag, attendeeIndex) {
      this.props.addTag(newTag, attendeeIndex);
    },
    removeTag: function(tagIndex, attendeeIndex) {
      this.props.removeTag(tagIndex, attendeeIndex);
    },
    editMeal: function(newMeal) {
      this.props.editMeal(newMeal, this.props.index);
    },
    render: function() {
        var colortag=this.props.tagcolor;
        var tagclick=this.handleTagClick;
        var mealclick=this.handleMealClick;
        var attendeeClick=this.handleAttendeeClick;
        var mealColor;
        var meal=this.props.attendee.meal;
        var attendeeColor;
        var that=this;
        var x=-1;

        if (this.props.mealcolor==meal)
        {
          mealColor="text-danger";
        }
        else
        {
          mealColor="text-primary";
        }
        if (this.props.attendee.email==this.props.selectAttendee || this.containsAttendingWith())
        {
          attendeeColor="text-danger";
        }
        else
        {
          attendeeColor="text-primary";
        }


        return (<tr name="attendee">
                <td><div onClick={function(){attendeeClick(that.props.attendee.email);}}><span className={attendeeColor}>
                {this.props.attendee.name}
            </span></div></td>
                <td>{this.props.attendee.email}</td>
                <td>{this.props.attendee.attendingWith}</td>
                <td>{this.props.attendee.tags.map(function(tag) {
                  x++;
                    return <Tag key={tag} index={x} attendeeindex={that.props.index} tag={tag} selecttag={colortag} tagClick={tagclick} removeTag={that.removeTag}/>;
                  })
                }<button className="btn btn-default" onClick={function(){that.addTag(prompt("Enter tag name"), that.props.index);}}>Add</button></td>
                <td><span className={mealColor} onClick={function(){mealclick(meal);}}>{meal}</span><button className="btn btn-link" onClick={function(){that.editMeal(prompt("Enter new meal"));}}>(edit)</button></td>
            </tr>
        );
    }
});



var Tag = React.createClass({
  handleTagClick: function(e) {
    this.props.tagClick(e);
  },
  removeTag: function() {
    this.props.removeTag(this.props.index, this.props.attendeeindex);
  },
  render: function() {
    var selected;
    var tag = this.props.tag;
    var clickTag = this.handleTagClick;
    var removetag= this.removeTag;
    if (tag===null)
    {
      return null;
    }
    if (this.props.selecttag==this.props.tag)
    {
      selected="btn btn-success";
    }
    else
    {
      selected="btn btn-primary";
    }
    return (<p><button className={selected} onClick={function(){clickTag(tag);}}>{this.props.tag}</button> <button className="btn btn-link" onClick={function(){removetag();}}>(remove)</button></p>);
  }
});
 
var NewForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var tags = React.findDOMNode(this.refs.Tags).value.trim();
    if (tags==="")
    {
      tags=null;
    }
    this.props.addAttendee({
        "name": React.findDOMNode(this.refs.Name).value.trim(),
        "email": React.findDOMNode(this.refs.Email).value.trim(),
        "attendingWith": [React.findDOMNode(this.refs.AttendingWith).value.trim()],
        "tags": [tags],
        "meal": React.findDOMNode(this.refs.Meal).value.trim()
    });
    React.findDOMNode(this.refs.Name).value = '';
    React.findDOMNode(this.refs.Email).value = '';
    React.findDOMNode(this.refs.AttendingWith).value = '';
    React.findDOMNode(this.refs.Tags).value = '';
    React.findDOMNode(this.refs.Meal).value = '';

    },
  render: function() {
    return (
      <form className="Attendee" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Name" ref="Name" /><br></br>
        <input type="text" placeholder="Email" ref="Email" /><br></br>
        <input type="text" placeholder="Attending With (Email Address)" ref="AttendingWith" /><br></br>
        <input type="text" placeholder="One tag" ref="Tags" /><br></br>
        <input type="text" placeholder="Meal" ref="Meal" /><br></br>
        <input type="submit" value="Add Attendee" />
      </form>
    );
  }
});
React.render(
    <div><AttendeeList url="attendees.json"/></div>,
    document.getElementById('container')
  );

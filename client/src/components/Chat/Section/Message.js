import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { UserOutlined } from '@ant-design/icons';

const Message = (props) => {
    return (
        			<ul class="chat-list">
        				{props.who === 'bot' ? 
						(<li class="in">
        					<div class="chat-img">
        						<img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar1.png"/>
        					</div>
        					<div class="chat-body">
        						<div class="chat-message">
        							<h5>{props.who}</h5>
        							<p>{props.text}</p>
        						</div>
        					</div>
        				</li> ) : (
        				<li class="out">
        					<div class="chat-img">
        						<img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar6.png"/>
        					</div>
        					<div class="chat-body">
        						<div class="chat-message">
        							<h5>{props.who}</h5>
        							<p>{props.text}</p>
        						</div>
        					</div>
        				</li>) }
        			</ul>
    );
};

export default Message;

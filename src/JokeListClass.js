import axios from "axios";
import React from "react";
import JokeClass from "./JokeClass";
import "./JokeList.css";

class JokeListClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {jokes:[]}
        this.seenJokes = new Set();
        this.sortedJokes = [];
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.vote = this.vote.bind(this);
    }
    
    async componentDidMount() {
        this.getJokes()
    }

    async componentDidUpdate() {
        this.getJokes()
    }

    async getJokes () {
        if (this.state.jokes.length > 0 ) {
            return 
        } else {
            const j = [...this.state.jokes]
            try {
                while (j.length < this.props.numJokesToGet) {
                    const response = await axios.get("https://icanhazdadjoke.com",
                    {headers: { Accept: "application/json" }})
                    let { status, ...jokeObj } = response.data;
                    if(!this.seenJokes.has(jokeObj.id)) {
                        this.seenJokes.add(jokeObj.id);
                        j.push({...jokeObj, votes: 0})
                    }
                }
                this.setState({jokes:[...j]});
            } catch (e) {
                console.log(e)
            }
        }
    }
    
    generateNewJokes() {
        this.sortedJokes = []
        this.setState({jokes:[]})
    }

    vote(id, delta) {
        this.setState({
            jokes: this.state.jokes.map(j => (j.id === id ? {...j, votes: j.votes + delta} : j)
            )})
    }



    render() {
        if (this.state.jokes.length) {
            this.sortedJokes = [...this.state.jokes].sort((a,b) => b.votes - a.votes)
        }
        return (
            <div className="JokeList">
                <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                Get New Jokes
                </button>
                {this.sortedJokes.map(j => (
                <JokeClass text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                ))}
                {/* loading widget that spins until data loads */}
                {this.sortedJokes.length < this.props.numJokesToGet ? 
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                :
                null
                }
            </div>
                )
            }
}

export default JokeListClass;
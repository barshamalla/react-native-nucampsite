import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, FlatList } from 'react-native';
import { Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId,rating,author,text) => (postComment(campsiteId,rating,author,text))
};


function RenderCampsite(props) {
    const {campsite} = props;
    
    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + campsite.name + ' to favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                );
            }
            return true;
        }
    });
   
    if (campsite) {
        return (
            <Animatable.View 
            animation='fadeInDown' 
            duration={2000} 
            delay={1000}
            ref={this.handleViewRef}
             {...panResponder.panHandlers}>
                <Card
                    featuredTitle={campsite.name}
                    
                    image={{uri: baseUrl + campsite.image}}> 
                    <Text style={{margin: 10}}>
                        {campsite.description}
                    </Text>
                    
            
                    <View style={styles.cardRow}> 
                    
                    <Icon 
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ? 
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />

            
                    <Icon style={styles.cardItem}
                        name={props.favorite ? 'pencil' : 'pencil'}
                        type='font-awesome'
                        color='#5637DD'
                        alignItems='right'
                        raised
                        reverse
                        onPress={() => props.onShowModal() } 
                        
                    />
                    </View>
                    
                </Card>
            </Animatable.View>
        );
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating 
                imageSize= {10}
                readonly
                startingValue={item.rating}
                style={{ alignItems:'flex-start', paddingVertical: '5%' }}>{item.rating} Stars</Rating>
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };
    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
            </Animatable.View>

    );
}

class CampsiteInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author:'',
            text:'',
            showModal: false
        };
    }
    
    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    };

 
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
    handleComment(campsiteId) {
        this.props.postComment(campsiteId,this.state.rating,this.state.author,this.state.text)
        this.toggleModal()
    }
    resetForm() {
        this.setState({
            rating: 5,
            author:'',
            text:'',
            showModal: false
        });
    }
    

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        
        return(
            <ScrollView>
                <RenderCampsite campsite={campsite}
                 onShowModal={() => this.toggleModal()}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                />
                <RenderComments comments={comments} />
                
               
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                        showRating
                        type='star'
                        startingValue={5}
                        imageSize={40}
                        onFinishRating={(rating) => this.setState({rating: rating})}
                        style={{paddingVertical: 10, alignItems: 'center'}}
                        >
                        </Rating>
                             
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={(author) => this.setState({author})}
                            value={this.state.author}
                            
                            >
                        </Input>
                            
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                           
                            >
                        </Input>

                    
                        <View style={{margin: 10}}>
                            <Button
                                title='submit' 
                                color='#5637DD'
                                onPress={() => {
                                    this.handleComment(campsiteId)
                                    this.resetForm()
                                }}
                                >
                            </Button>
                        </View>
                        
                        <View style={{margin: 10}}>
                    
                            <Button
                                onPress={() => {
                                    this.toggleModal()
                                    this.resetForm()
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
             </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
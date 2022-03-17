import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

//components
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';

// actions
import { loginUser, updateError } from '../../store/actions/user';
import CustomButton from '../../components/CustomButton/CustomButton';
import { ReactComponent as Google } from '../../assets/icons/google.svg';
import { ReactComponent as Facebook } from '../../assets/icons/facebook.svg';
//helpers
import { loginUserWithGoogle } from '../../store/actions/user';
import { validateLoginData } from './../../utils/validators';

class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.userData !== prevProps.userData) {
			this.props.history.push('/admin/products');
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();

		const { email, password } = this.state;
		const { loginUser, updateError } = this.props;

		const { valid, errors } = validateLoginData({ email, password });

		if (!valid) updateError(errors);
		if (valid) loginUser(email, password);
	}

	render() {
		if (this.props.userLoading) {
			return <Loader />;
		} else {
			return (
				<div className='columns is-centered is-vcentered'>
					<div className='column is-one-quarter'>
						<form
							onSubmit={(e) => {
								this.handleSubmit(e);
							}}>
							<h1 className='title'>Sign in</h1>
							{this.props.userError.error && <Error error={this.props.userError.error} />}
							<div className='field'>
								<label className='label'>Email</label>
								<input
									className='input'
									placeholder='Email'
									name='email'
									value={this.state.email}
									onChange={(e) => this.handleChange(e)}
								/>
								{this.props.userError.email && <Error error={this.props.userError.email} />}
							</div>
							<div className='field'>
								<label className='label'>Password</label>
								<input
									className='input'
									placeholder='Password'
									name='password'
									type='password'
									value={this.state.password}
									onChange={(e) => this.handleChange(e)}
								/>
								{this.props.userError.password && <Error error={this.props.userError.password} />}
							</div>
							<button className='button is-primary'>Submit</button>
						</form>
						<Link to='/admin/signup'>Need an account? Sign Up</Link>
						<p className='my-2'>or</p>
				       <CustomButton
					    className='btn btn-outline-dark d-flex align-items-center'
					    onClick={() => this.props.loginUserWithGoogle()}>
					    <Google className='w-50 mr-3' />
					    <span className='text-nowrap pr-3'>Log In with Google</span>
				      </CustomButton>
				      <CustomButton
				    	enabled
					    className='btn btn-outline-dark flex flex-col flex-wrap mt-5 '
					    onClick={() => this.props.loginUserWithGoogle()}>
					    <Facebook className='flex flex-col flex-wrap w-50 mr-9 p-96' />
					      <span className='text-nowrap'>Log In with Facebook</span>
				      </CustomButton>
					</div>
				</div>
			);
		}
	}
}

function mapStateToProps(state) {
	return {
		userData: state.user.data,
		userLoading: state.user.loading,
		userError: state.user.error
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loginUser: (email, password) => {
			dispatch(loginUser(email, password));
		},
		loginUserWithGoogle: () => {
			dispatch(loginUserWithGoogle());
		},
		updateError: (payload) => {
			dispatch(updateError(payload));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);

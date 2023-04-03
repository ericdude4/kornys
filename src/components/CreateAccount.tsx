import { FormLayout, TextField, Button, InlineError } from '@shopify/polaris';
import { useState } from 'react';
import { ActionFunctionArgs, Form, useActionData } from 'react-router-dom';
import { post } from '../fetch';
import { storeHost, authenticatedRedirect } from '../utils';
import InlineApiErrors from './InlineApiErrors';

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const formEntries: any = Object.fromEntries(formData);
    const response: any = await post("/create_user", { name: formEntries.name, email: formEntries.email, password: formEntries.password });

    if (response.errors) {
        return response.errors
    } else {
        return authenticatedRedirect("/" + storeHost(params.storeUrl) + formEntries.scopedRedirectAfter);
    }
}

type CreateAccountProps = {
    // where to redirect after successful login
    scopedRedirectAfter: string
}

export default function CreateAccount({ scopedRedirectAfter }: CreateAccountProps) {
    const errors: any = useActionData() || {};

    const [name, handleNameChange] = useState('');
    const [email, handleEmailChange] = useState('');
    const [password, handlePasswordChange] = useState('');

    return (
        <Form method="post" id="contact-form">
            <FormLayout>
                <input hidden name='scopedRedirectAfter' value={scopedRedirectAfter} readOnly />
                <TextField
                    value={name}
                    onChange={handleNameChange}
                    label="Name"
                    id='create_name'
                    type="text"
                    name="name"
                    autoComplete="name"
                />
                <TextField
                    value={email}
                    onChange={handleEmailChange}
                    label="Email"
                    id='create_email'
                    type="email"
                    name="email"
                    autoComplete="email"
                    helpText={
                        <span>
                            This email address will also be used for customer support requests.
                        </span>
                    }

                />
                <TextField
                    value={password}
                    onChange={handlePasswordChange}
                    label="Password"
                    id="create_password"
                    type="password"
                    name="password"
                    autoComplete="password"
                />


                {errors ? (<InlineApiErrors scope='create' apiErrors={errors} />) : null}
                <Button submit primary>Create Synkro account</Button>
            </FormLayout>
        </Form>

    );
}

import { FormLayout, TextField, Button, InlineError } from '@shopify/polaris';
import { useState } from 'react';
import { ActionFunctionArgs, Form, useActionData } from 'react-router-dom';
import { post } from '../fetch';
import { storeHost, authenticatedRedirect } from '../utils';

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const formEntries: any = Object.fromEntries(formData);
    const response: any = await post("/connect_to_user", { email: formEntries.email, password: formEntries.password });

    if (response.errors) {
        return response.errors
    } else {
        return authenticatedRedirect("/" + storeHost(params.storeUrl) + formEntries.scopedRedirectAfter);
    }
}

type LoginProps = {
    // where to redirect after successful login
    scopedRedirectAfter: string
}

export default function Login({ scopedRedirectAfter }: LoginProps) {
    const errors: any = useActionData() || {};

    const [email, handleEmailChange] = useState('');
    const [password, handlePasswordChange] = useState('');

    return (
        <Form method="post" id="contact-form">
            <FormLayout>
                <input hidden name='scopedRedirectAfter' value={scopedRedirectAfter} readOnly/>
                <TextField
                    value={email}
                    onChange={handleEmailChange}
                    label="Email"
                    id='email'
                    type="email"
                    name="email"
                    autoComplete="email"
                    helpText={
                        <span>
                            We’ll use this email address to inform you on future changes to
                            Polaris.
                        </span>
                    }
                />
                <TextField
                    value={password}
                    onChange={handlePasswordChange}
                    label="Password"
                    type="password"
                    name="password"
                    autoComplete="password"
                    helpText={
                        <span>
                            We’ll use this email address to inform you on future changes to
                            Polaris.
                        </span>
                    }
                />

                {errors.authentication ? (<InlineError message={errors.authentication} fieldID={'email'} />) : null}
                <Button submit>Submit</Button>
            </FormLayout>
        </Form>

    );
}

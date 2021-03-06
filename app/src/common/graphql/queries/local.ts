import { gql } from "@apollo/client";

export const GET_AUTH_STATE = gql`
    query GetAuthState {
        authState @client {
            accessToken
        }
    }
`;

export const GET_LOCAL_USER = gql`
    query GetLocalUser {
        localUser @client {
            id
            email
        }
    }
`;

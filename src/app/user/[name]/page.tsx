import SecretApp from '@/components/secret-app';

type UserPageProps = {
  params: {
    name: 'Meruputhiga' | 'Pikachu';
  };
};

export default function UserPage({ params }: UserPageProps) {
  const { name } = params;

  if (name !== 'Meruputhiga' && name !== 'Pikachu') {
    return <div>Sorry, user not found.</div>;
  }
  
  return <SecretApp currentUser={name} />;
}

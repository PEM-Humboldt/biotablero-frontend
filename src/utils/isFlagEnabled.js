import ExternalRequests from 'utils/externalRequests';

const isFlagEnabled = (id) => (
  ExternalRequests.requestFeaturesFlags(
    'https://biotablero.s3.amazonaws.com/featureFlagsEnabled.json',
  )
  .then((res) => {
    const feature = res.find((obj) => obj.id === id);
    return feature ? feature.enabled : false;
  })
  .catch(() => false)
);

export default isFlagEnabled;

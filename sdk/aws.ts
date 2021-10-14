import AWS from 'aws-sdk';

AWS.config.update({
	accessKeyId: 'AKIA5H6YUBGE6WZQX5VF',
	secretAccessKey: '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',
});

const params = {
	Bucket: 'testbucket555333001',
	CreateBucketConfiguration: {
		LocationConstraint: 'us-east-2',
	},
};

export const bucket = 'testbucket000555333';

export const bucketPath =
	'https://testbucket000555333.s3.us-east-2.amazonaws.com';

export { AWS };

export const s3 = new AWS.S3();

export { params };

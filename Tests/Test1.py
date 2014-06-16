import sys
def main():
	output = ""
	for line in sys.stdin:
		output = output + line
	if output.count('{"insertCount":25,"success":true}') < 3:
		print "FAILURE: Not enough successful posts to OLL"
	elif output.count('{"insertCount":25,"success":true}') > 3:
		print "FAILURE: Too many successful posts to OLL"
	else:
		print "SUCCESS"

main()
function getIpFromHeader(header) {
    if (!header) {
      return null;
    }
  
    // The 'X-Forwarded-For' header may contain a comma-separated list of IP addresses
    // The client's IP address is typically the first entry in the list
    const ipAddresses = header.split(',');
  
    // Extract the first IP address from the list
    const ipAddress = ipAddresses[0].trim();
  
    return ipAddress;
  }
  
  module.exports = { getIpFromHeader };
  